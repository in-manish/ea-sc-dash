import { useState } from 'react';
import {
  permanentlyDeleteUserSavedCard,
  restoreUserSavedCard,
} from '../api/userCardsApi';
import { getSavedCardId } from '../domain/savedCardHelpers';

/** Admin restore + permanent delete for a user's saved cards. */
export default function useSavedCardMutations({ userId, token }) {
  const [busyCardId, setBusyCardId] = useState(null);
  const [error, setError] = useState('');

  const run = async (card, action) => {
    const cardId = getSavedCardId(card);
    if (cardId == null) {
      setError('Missing card_id for this card.');
      throw new Error('Missing card_id');
    }
    if (!token || !userId) {
      setError('Not authenticated.');
      throw new Error('Not authenticated');
    }
    setBusyCardId(cardId);
    setError('');
    try {
      return await action(cardId);
    } catch (err) {
      setError(err.message || 'Card action failed.');
      throw err;
    } finally {
      setBusyCardId(null);
    }
  };

  const restore = (card) =>
    run(card, (cardId) => restoreUserSavedCard(token, userId, cardId));

  const permanentlyDelete = (card) =>
    run(card, (cardId) => permanentlyDeleteUserSavedCard(token, userId, cardId));

  return {
    busyCardId,
    error,
    clearError: () => setError(''),
    restore,
    permanentlyDelete,
    isBusy: (card) => {
      const id = getSavedCardId(card);
      return id != null && busyCardId === id;
    },
  };
}
