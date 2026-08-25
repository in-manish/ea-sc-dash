import { activeBadgeApi, buildActiveBadgeBody } from '../api/activeBadgeApi';
import {
  eligibleForCreate,
  summarizeStatus,
  summarizeCreate,
} from '../domain/summarizeActiveBadge';

export async function fetchActiveBadgeStatus(
  eventId,
  token,
  body,
) {
  const raw = await activeBadgeApi.getStatus(eventId, token, body);
  return summarizeStatus(raw, {
    allWithoutActive: Boolean(body.all_without_active),
  });
}

export async function createActiveBadges(eventId, token, body) {
  const raw = await activeBadgeApi.create(eventId, token, body);
  return summarizeCreate(raw, {
    allWithoutActive: Boolean(body.all_without_active),
  });
}

export function selectedStatusBody(uuids) {
  return buildActiveBadgeBody({ uuids });
}

export function allEligibleBody() {
  return buildActiveBadgeBody({ allWithoutActive: true });
}

export function createFromEligibleItems(items) {
  return buildActiveBadgeBody({
    uuids: eligibleForCreate(items).map((i) => i.uuid).filter(Boolean),
  });
}

export function noneEligibleMessage(status) {
  if (status?.active?.length) {
    return 'All selected badges already have an active badge.';
  }
  return 'No selected badges are eligible (need email or phone).';
}

export function confirmCreateMessage(count, { all = false, selectedTotal } = {}) {
  if (all) {
    return `Create active badges for ${count} eligible attendee${count === 1 ? '' : 's'}? SnapCard sync runs first when evc_id is missing.`;
  }
  if (selectedTotal != null) {
    return `Create active badges for ${count} of ${selectedTotal} selected? Already-active badges are skipped.`;
  }
  return `Create active badges for ${count} eligible attendee${count === 1 ? '' : 's'}?`;
}
