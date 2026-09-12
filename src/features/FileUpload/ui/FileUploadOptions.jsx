const FileUploadOptions = ({
  keepName,
  onKeepName,
  isS3Link,
  onIsS3Link,
  replaceLink,
  onReplaceLink,
  selectedFileName,
}) => {
  return (
    <div className="space-y-2">
      <label
        className={`flex items-start gap-2 text-xs text-text-primary ${
          isS3Link ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <input
          type="checkbox"
          className="mt-0.5 rounded border-border text-accent focus:ring-accent"
          checked={keepName && !isS3Link}
          disabled={isS3Link}
          onChange={(event) => onKeepName(event.target.checked)}
        />
        <span>
          Keep original filename
          {keepName && !isS3Link && selectedFileName ? (
            <span className="block text-[11px] text-text-secondary mt-0.5">
              Will store as {selectedFileName} (overwrites if that name exists).
            </span>
          ) : (
            <span className="block text-[11px] text-text-secondary mt-0.5">
              Use the local basename instead of a UUID.
            </span>
          )}
        </span>
      </label>

      <div className="space-y-1.5">
        <label className="block text-xs text-text-primary" htmlFor="file-upload-link">
          File URL
          <span className="block text-[11px] text-text-secondary font-normal mt-0.5">
            Previous upload URL from this API, if you are replacing that file.
          </span>
        </label>
        <input
          id="file-upload-link"
          type="url"
          value={replaceLink}
          onChange={(event) => onReplaceLink(event.target.value)}
          placeholder="https://host/schema/general/files/brochure.pdf"
          className="w-full rounded-md border border-border bg-bg-secondary px-2 py-1.5 text-[11px] text-text-primary placeholder:text-text-tertiary"
        />
        <label className="flex items-start gap-2 text-xs text-text-primary cursor-pointer">
          <input
            type="checkbox"
            className="mt-0.5 rounded border-border text-accent focus:ring-accent"
            checked={isS3Link}
            onChange={(event) => onIsS3Link(event.target.checked)}
          />
          <span>
            Replace file at this URL
            <span className="block text-[11px] text-text-secondary mt-0.5">
              Overwrites that stored file so existing links keep working.
            </span>
          </span>
        </label>
      </div>
    </div>
  );
};

export default FileUploadOptions;
