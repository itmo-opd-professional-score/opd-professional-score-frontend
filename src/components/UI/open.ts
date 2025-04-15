import { testBlockResolver } from './TestBlockElement.vue';

export const open = async () => {
const blockId = useSlots();
if (blockId) {
const testBlock = await testBlockResolver.getById(blockId);
console.log(testBlock);
}

};
