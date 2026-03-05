import { eventService } from '../../services/eventService';

export const arSyncService = {
    async fetchSourceData(eventId, token) {
        try {
            const groupsData = await eventService.getARGroups(eventId, token);
            const groups = groupsData.results || groupsData;

            const detailedGroups = await Promise.all(groups.map(async (group) => {
                const productsData = await eventService.getARProducts(eventId, group.id, token);
                return {
                    ...group,
                    products: productsData.results || productsData
                };
            }));

            return detailedGroups;
        } catch (error) {
            console.error('Fetch Source Data Error:', error);
            throw error;
        }
    },

    /**
     * Syncs multiple groups and products using the single Copy API.
     * @param {number|string} targetEventId 
     * @param {number|string} sourceEventId 
     * @param {Array} selection - Array of {groupId, productIds[]}
     * @param {string} token 
     */
    async copyData(targetEventId, sourceEventId, selection, token) {
        try {
            const payload = {
                source_event_id: parseInt(sourceEventId),
                groups: selection.map(item => ({
                    group_id: item.groupId,
                    product_ids: item.productIds || []
                }))
            };

            return await eventService.copyAdditionalRequirements(targetEventId, token, payload);
        } catch (error) {
            console.error('Copy Data Error:', error);
            throw error;
        }
    }
};
