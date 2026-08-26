import { attendeeSearchQuery } from '../domain/campaignHelpers';
import HoverActionButton, { HOVER_REVEAL } from './HoverActionButton';

/** Hidden until the parent `tr.group` is hovered; opens the attendee list for this recipient. */
export default function RecipientRowActions({ recipient, onViewAttendee }) {
  const query = attendeeSearchQuery(recipient);

  return (
    <div className={`flex items-center justify-start ${HOVER_REVEAL}`}>
      <HoverActionButton
        disabled={!query}
        onClick={() => onViewAttendee?.(recipient)}
      >
        View attendee
      </HoverActionButton>
    </div>
  );
}
