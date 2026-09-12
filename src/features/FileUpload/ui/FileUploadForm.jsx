import FileUploadOptions from './FileUploadOptions';
import FloatingFileInput from './FloatingFileInput';

const FileUploadForm = ({
  selectedFile,
  onFile,
  keepName,
  onKeepName,
  isS3Link,
  onIsS3Link,
  replaceLink,
  onReplaceLink,
  isUploading,
  onUpload,
}) => {
  return (
    <div className="space-y-3">
      <FloatingFileInput onFile={onFile} />
      {selectedFile ? (
        <p className="text-[11px] text-text-secondary truncate" title={selectedFile.name}>
          Selected: {selectedFile.name}
        </p>
      ) : null}
      <FileUploadOptions
        keepName={keepName}
        onKeepName={onKeepName}
        isS3Link={isS3Link}
        onIsS3Link={onIsS3Link}
        replaceLink={replaceLink}
        onReplaceLink={onReplaceLink}
        selectedFileName={selectedFile?.name}
      />
      <button
        type="button"
        onClick={onUpload}
        disabled={isUploading}
        className="w-full py-2 px-3 text-sm rounded-md border-none bg-accent text-white cursor-pointer hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isUploading ? 'Uploading...' : isS3Link ? 'Replace file' : 'Upload file'}
      </button>
    </div>
  );
};

export default FileUploadForm;
