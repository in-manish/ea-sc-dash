import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const CREATE_PARAM = 'create_type';
const RETURN_PARAM = 'return_to';

// Only go back inside the dashboard's own event pages.
const isSafeReturn = (path) => typeof path === 'string' && /^\/event\/\d+\//.test(path);

/**
 * Link support: `?create_type=<slug>&return_to=<path>` opens the template creator for that type,
 * and sends the admin back to `return_to` after saving or closing it.
 */
export default function useCreateTemplateFromLink(editor) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const createType = searchParams.get(CREATE_PARAM);
  const returnTo = searchParams.get(RETURN_PARAM);
  const started = useRef(false);
  const wasOpen = useRef(false);
  const { createFromType, previewTemplate } = editor;

  useEffect(() => {
    if (!createType || started.current) return;
    started.current = true;
    createFromType(createType);
  }, [createType, createFromType]);

  useEffect(() => {
    if (!started.current) return;
    if (previewTemplate) {
      wasOpen.current = true;
      return;
    }
    if (!wasOpen.current) return;
    wasOpen.current = false;
    started.current = false;
    if (isSafeReturn(returnTo)) {
      navigate(returnTo, { replace: true });
      return;
    }
    setSearchParams((params) => {
      params.delete(CREATE_PARAM);
      params.delete(RETURN_PARAM);
      return params;
    }, { replace: true });
  }, [previewTemplate, returnTo, navigate, setSearchParams]);
}
