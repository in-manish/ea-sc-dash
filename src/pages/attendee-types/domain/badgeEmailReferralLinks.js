import { inviteeSlugFromTitle } from '../../../components/email/templates/domain/inviteeLinkPlaceholder';

/** EA ReferralLinkPlaceholders.TV_TOKEN — complimentary_invitee_base_link. */
export const TV_REFERRAL_LINK_VARIABLE = {
    name: 'tv_referral_link',
    description:
        'Trade visitor ticket referral URL (utm_source=ref_<base64 email>). Other types use {title_slug}_referral_link.',
};

export const REFERRAL_LINK_NAME_RE = '[A-Za-z][A-Za-z0-9_]*_referral_link';

/** EA: 'Hosted Buyer' → hosted_buyer_referral_link. */
export function buildReferralLinkPlaceholder(title) {
    const trimmed = String(title || '').trim();
    const slug = inviteeSlugFromTitle(trimmed);
    if (!slug) return null;
    return {
        name: `${slug}_referral_link`,
        description: `${trimmed} ticket referral URL`,
        title: trimmed,
    };
}

export function referralPlaceholdersFromInviteeLinks(links) {
    const seen = new Set();
    const out = [];
    (links || []).forEach((item) => {
        const built = buildReferralLinkPlaceholder(item?.title);
        if (!built || seen.has(built.name)) return;
        seen.add(built.name);
        out.push(built);
    });
    return out;
}
