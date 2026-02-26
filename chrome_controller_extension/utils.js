function getContainersWithItems(containers)
{
    let containersWithItems = [];
        
    containers.forEach((container, containerIndex) => {
        const containerElements = Array.from(document.querySelectorAll(container.selectors));
        console.log(containerElements);
        const containerWithItems = containerElements.map((el) => {
            const items = Array.from(el.querySelectorAll(container.itemsSelectors)).filter(item => {
                const itemRect = item.getBoundingClientRect();
                return itemRect.x >= -2 && itemRect.x + itemRect.width < window.innerWidth;
            });

            return {
                items: items,
                containerIndex: containerIndex
            };
        }).filter(container => container.items.length > 0);

        containersWithItems = containersWithItems.concat(containerWithItems);
    });

    return containersWithItems;
}