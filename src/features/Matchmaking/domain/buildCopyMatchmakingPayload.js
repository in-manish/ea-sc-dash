export function buildCopyMatchmakingPayload({
    fromEventId,
    toEventId,
    mappings = [],
    selectedIds = [],
}) {
    const payload = {
        from_event_id: Number(fromEventId),
        to_event_id: Number(toEventId),
        question_ids: selectedIds.map(Number),
        attendee_types_data: mappings
            .filter((row) => row.from && row.to)
            .map((row) => ({
                from_attendee_type_name: row.from,
                to_attendee_type_name: row.to,
            })),
    };
    return payload;
}

export function defaultTypeMappings(sourceTypes = [], destTypes = []) {
    return sourceTypes.map((source) => {
        const match = destTypes.find((dest) => dest.name === source.name);
        return { from: source.name, to: match?.name || '' };
    });
}
