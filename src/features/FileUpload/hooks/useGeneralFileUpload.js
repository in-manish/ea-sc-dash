import { useState } from 'react';
import { fileUploadService } from '../api/fileUploadApi';
import { isGeneralFileLink } from '../domain/generalFileLink';

const successCopy = (mode) => {
  if (mode === 'replace') return 'File replaced. Existing URL is unchanged.';
  if (mode === 'keep_name') return 'File uploaded with the original filename.';
  return 'File uploaded successfully.';
};

export function useGeneralFileUpload({ token, onUploaded }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [keepName, setKeepName] = useState(false);
  const [isS3Link, setIsS3Link] = useState(false);
  const [replaceLink, setReplaceLink] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activeUrl, setActiveUrl] = useState('');

  const startReplace = (url) => {
    if (!isGeneralFileLink(url)) {
      setError('Invalid or unsupported file link');
      return;
    }
    setReplaceLink(url);
    setIsS3Link(true);
    setKeepName(false);
    setError('');
    setSuccessMessage('');
  };

  const onIsS3Link = (checked) => {
    setIsS3Link(checked);
    if (checked) setKeepName(false);
  };

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setSuccessMessage('URL copied to clipboard.');
      setError('');
    } catch {
      setError('Copy failed. Please copy manually.');
    }
  };

  const onUpload = async () => {
    if (!selectedFile) {
      setError('Select a file first.');
      return;
    }

    setIsUploading(true);
    setError('');
    setSuccessMessage('');

    try {
      let result;
      if (isS3Link) {
        result = await fileUploadService.uploadFile(selectedFile, token, {
          link: replaceLink.trim(),
          isS3Link: true,
        });
      } else if (keepName) {
        result = await fileUploadService.uploadFile(selectedFile, token, { keepName: true });
      } else {
        result = await fileUploadService.uploadFile(selectedFile, token);
      }
      const url = result.fileUrl || '';
      onUploaded?.({
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        fileUrl: url,
        filePath: result.filePath,
        contentType: result.contentType,
        contentGroup: result.contentGroup,
        replaced: result.mode === 'replace',
      });
      setActiveUrl(url);
      setSelectedFile(null);
      setSuccessMessage(successCopy(result.mode));
    } catch (uploadError) {
      setError(uploadError.message || 'Upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  return {
    selectedFile,
    setSelectedFile,
    keepName,
    setKeepName,
    isS3Link,
    onIsS3Link,
    replaceLink,
    setReplaceLink,
    startReplace,
    isUploading,
    error,
    successMessage,
    activeUrl,
    onUpload,
    copyText,
  };
}
