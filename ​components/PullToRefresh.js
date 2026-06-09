export default {
    props: ['isPulling', 'refreshTransform', 'isRefreshing'],
    template: `
        <div class="pull-refresh-indicator" :class="{ pulling: isPulling }" :style="{ transform: refreshTransform }">
            <span class="material-symbols-rounded" :class="{ 'refresh-spinning': isRefreshing }">sync</span>
        </div>
    `
};
