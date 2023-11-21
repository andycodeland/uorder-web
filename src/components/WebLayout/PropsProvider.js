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
        locales,
        items,
        notificationCount,
        MenuList,
        dispatch,
        history,
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
        locales,
        items,
        notificationCount,
        MenuList,
        dispatch,
        history,
    };
}
