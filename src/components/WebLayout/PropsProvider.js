export default function propsProvider(props) {
    const {
        t,
        i18n,
        children,
        collapsed,
        setCollapsed,
        current,
        onOpenChange,
        openSiderKeys,
        handleMenuClick,
        colorBgContainer,
        handleChangeLocales,
        languages,
        items,
        notificationCount,
        MenuList,
        dispatch,
        history,
        access,
        contextHolder,
        breadcrumbItems,
    } = props;
    return {
        t,
        i18n,
        children,
        collapsed,
        setCollapsed,
        current,
        onOpenChange,
        openSiderKeys,
        handleMenuClick,
        colorBgContainer,
        handleChangeLocales,
        languages,
        items,
        notificationCount,
        MenuList,
        dispatch,
        history,
        access,
        contextHolder,
        breadcrumbItems,
    };
}
