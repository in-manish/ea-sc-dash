import { useState, useEffect } from 'react';
import { userService } from '../../../services/userService';

export const toEditForm = (user) => ({
  id: user.id,
  name: user.name || '',
  email: user.email || '',
  phone_number: user.phone_number || '',
  is_verified_email: user.is_verified_email === true,
  is_verified_phone_number: user.is_verified_phone_number === true,
});

/** Edit form state + duplicate contact lookups for SC admin users. */
export default function useEditUserForm({ user, token, isOpen }) {
  const [editingUser, setEditingUser] = useState(null);
  const [originalUserValues, setOriginalUserValues] = useState(null);
  const [duplicateUsersByEmail, setDuplicateUsersByEmail] = useState([]);
  const [duplicateUsersByPhone, setDuplicateUsersByPhone] = useState([]);
  const [ignoreEmailWarnings, setIgnoreEmailWarnings] = useState(false);
  const [ignorePhoneWarnings, setIgnorePhoneWarnings] = useState(false);
  const [pendingVerify, setPendingVerify] = useState(null);

  const loadUser = (next) => {
    const vals = toEditForm(next);
    setEditingUser(vals);
    setOriginalUserValues(vals);
    setDuplicateUsersByEmail([]);
    setDuplicateUsersByPhone([]);
    setIgnoreEmailWarnings(false);
    setIgnorePhoneWarnings(false);
    setPendingVerify(null);
  };

  useEffect(() => {
    if (isOpen && user) loadUser(user);
    if (!isOpen) {
      setEditingUser(null);
      setPendingVerify(null);
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (!editingUser || !isOpen) return;

    const emailTimer = setTimeout(async () => {
      const email = editingUser.email;
      if (!email) {
        setDuplicateUsersByEmail([]);
        return;
      }
      try {
        const response = await userService.adminGetUsers({ email }, token);
        const matches = (response?.results || []).filter(
          (u) => String(u.id) !== String(editingUser.id)
        );
        setDuplicateUsersByEmail(matches);
      } catch {
        setDuplicateUsersByEmail([]);
      }
    }, 400);

    const phoneTimer = setTimeout(async () => {
      const phone = editingUser.phone_number;
      if (!phone) {
        setDuplicateUsersByPhone([]);
        return;
      }
      try {
        const response = await userService.adminGetUsers({ phone_number: phone }, token);
        const matches = (response?.results || []).filter(
          (u) => String(u.id) !== String(editingUser.id)
        );
        setDuplicateUsersByPhone(matches);
      } catch {
        setDuplicateUsersByPhone([]);
      }
    }, 400);

    return () => {
      clearTimeout(emailTimer);
      clearTimeout(phoneTimer);
    };
  }, [
    editingUser?.email,
    editingUser?.phone_number,
    editingUser?.id,
    isOpen,
    token,
  ]);

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'is_verified_email' || name === 'is_verified_phone_number') {
      return; // handled by requestVerifyToggle
    }
    setEditingUser((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (name === 'email') setIgnoreEmailWarnings(false);
    if (name === 'phone_number') setIgnorePhoneWarnings(false);
  };

  /** Intercept verify checkbox: require AWS confirm when duplicates exist. */
  const requestVerifyToggle = (field, nextChecked) => {
    if (!nextChecked) {
      setEditingUser((prev) => ({ ...prev, [field]: false }));
      return;
    }
    const contactType = field === 'is_verified_email' ? 'email' : 'phone';
    const duplicates =
      contactType === 'email' ? duplicateUsersByEmail : duplicateUsersByPhone;

    // Also warn if contact matches others even when value unchanged (shared contact).
    const runLookupThenConfirm = async () => {
      let matches = duplicates;
      if (!matches.length) {
        try {
          const query =
            contactType === 'email'
              ? { email: editingUser.email }
              : { phone_number: editingUser.phone_number };
          const response = await userService.adminGetUsers(query, token);
          matches = (response?.results || []).filter(
            (u) => String(u.id) !== String(editingUser.id)
          );
          if (contactType === 'email') setDuplicateUsersByEmail(matches);
          else setDuplicateUsersByPhone(matches);
        } catch {
          matches = [];
        }
      }
      if (matches.length > 0) {
        setPendingVerify({ field, contactType, duplicates: matches });
        return;
      }
      setEditingUser((prev) => ({ ...prev, [field]: true }));
    };

    runLookupThenConfirm();
  };

  const confirmPendingVerify = () => {
    if (!pendingVerify) return;
    setEditingUser((prev) => ({ ...prev, [pendingVerify.field]: true }));
    setPendingVerify(null);
  };

  const isDirty =
    Boolean(editingUser) &&
    Boolean(originalUserValues) &&
    (editingUser.name !== originalUserValues.name ||
      editingUser.email !== originalUserValues.email ||
      editingUser.phone_number !== originalUserValues.phone_number ||
      editingUser.is_verified_email !== originalUserValues.is_verified_email ||
      editingUser.is_verified_phone_number !== originalUserValues.is_verified_phone_number);

  return {
    editingUser,
    setEditingUser,
    duplicateUsersByEmail,
    duplicateUsersByPhone,
    ignoreEmailWarnings,
    ignorePhoneWarnings,
    setIgnoreEmailWarnings,
    setIgnorePhoneWarnings,
    pendingVerify,
    setPendingVerify,
    handleEditChange,
    requestVerifyToggle,
    confirmPendingVerify,
    loadUser,
    isDirty,
  };
}
