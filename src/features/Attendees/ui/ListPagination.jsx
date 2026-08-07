const ListPagination = ({ page, loading, hasNext, onPrev, onNext }) => (
    <div className="flex justify-end items-center gap-4 mt-6">
        <button
            className="btn btn-secondary btn-sm"
            disabled={page === 1 || loading}
            onClick={onPrev}
        >
            Previous
        </button>
        <span className="text-sm text-text-secondary">Page {page}</span>
        <button
            className="btn btn-secondary btn-sm"
            disabled={!hasNext || loading}
            onClick={onNext}
        >
            Next
        </button>
    </div>
);

export default ListPagination;
