import { Form, message, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import TableColumns from '../../../components/CustomTable/columnConfigs';
import { hideLoading, showLoading } from '../../../components/FullPageLoading/LoadingSlice';
import { NotificationTarget, UseNotification, UserAction } from '../../../components/UseNotification';
import Utils from '../../../utilities';
import propsProvider from './PropsProvider';
import { createDishAdmin, deleteDishAdmin, getListDishAdmin, updateDishAdmin } from './Slice';
import MainView from './template/MainView';

function Conainer(props) {
    const { history, t, dispatch } = props;
    const columns = TableColumns.DishColumns(t);
    const expandedRowRenderSelection = TableColumns.ExpandedRowRenderSelection;
    const [tableData, setTableData] = useState([]);
    const [createForm] = Form.useForm();
    const [editForm] = Form.useForm();
    const [openCreateModel, setOpenCreateModel] = useState(false);
    const [openEditModel, setOpenEditModel] = useState(false);
    const [loadingsRefreshButton, setLoadingsRefreshButton] = useState([]);
    const [messageApi, messageContextHolder] = message.useMessage();
    const [defaultFile, setDefaultFile] = useState([]);

    const fetchData = async () => {
        dispatch(showLoading());
        try {
            await dispatch(getListDishAdmin()).then((result) => {
                console.log(result);
                setTableData(Utils.getValues(result, 'payload', []));
            });
        } catch (error) {
            console.error(error);
        } finally {
            dispatch(hideLoading());
        }
    };

    useEffect(() => {
        fetchData();
    }, [dispatch]);

    const handleCreateNewClick = () => {
        setOpenCreateModel(true);
    };

    const handleEditCancelClick = () => {
        setOpenEditModel(false);
    };

    const handleCreateCancelClick = () => {
        setOpenCreateModel(false);
    };

    const handleActionButtonEditClick = (data) => {
        setDefaultFile(data.coverLink != null ? data.coverLink : '');
        editForm.setFieldsValue({ ...data });
        setOpenEditModel(true);
    };

    const handleActionButtonDeleteClick = (data) => {
        function onOk() {
            dispatch(deleteDishAdmin(data.id));
            fetchData();
        }
        Modal.confirm(UseNotification.Modal.DeleteModal(t, NotificationTarget.Dish, onOk));
    };

    const handleActionButtonTurnOffClick = (data) => {
        function onOk() {
            const modifiedItem = {
                ...data,
                isActive: false,
            };
            dispatch(updateDishAdmin(modifiedItem));
            fetchData();
        }
        Modal.confirm(UseNotification.Modal.TurnOffModal(t, NotificationTarget.Dish, onOk));
    };

    const handleActionButtonTurnOnClick = (data) => {
        function onOk() {
            const modifiedItem = {
                ...data,
                isActive: true,
            };
            dispatch(updateDishAdmin(modifiedItem));
            fetchData();
        }
        Modal.confirm(UseNotification.Modal.TurnOnModal(t, NotificationTarget.Dish, onOk));
    };

    const handleCreateSubmitClick = (values) => {
        createForm
            .validateFields()
            .then(() => {
                messageApi
                    .open(UseNotification.Message.InProgressMessage(t))
                    .then(() => {
                        const priceParse = parseInt(values.price.replace(/[^0-9]/g, ''));
                        const completionTimeParse = parseInt(values.completionTime.replace(/[^0-9]/g, ''));
                        const qtyPerDayParse = parseInt(values.qtyPerDay.replace(/[^0-9]/g, ''));
                        const modifiedItem = {
                            ...values,
                            price: priceParse,
                            completionTime: completionTimeParse,
                            qtyPerDay: qtyPerDayParse,
                            cover: values.cover.file.originFileObj,
                        };
                        console.log(modifiedItem);
                        dispatch(createDishAdmin(modifiedItem));
                        UseNotification.Message.FinishMessage(t, UserAction.CreateFinish);
                        setOpenCreateModel(false);
                        fetchData();
                    })
                    .then(() => createForm.resetFields());
            })
            .catch(() => {
                UseNotification.Message.FinishFailMessage(t, UserAction.CreateFinishFail);
            });
    };

    const handleEditSubmitClick = async (values) => {
        editForm
            .validateFields()
            .then(() => {
                messageApi
                    .open(UseNotification.Message.InProgressMessage(t))
                    .then(async () => {
                        let priceParse = 0;
                        let completionTimeParse = 0;
                        let qtyPerDayParse = 0;
                        if (!Number.isInteger(values.price)) {
                            priceParse = parseInt(values.price.replace(/[^0-9]/g, ''));
                        } else {
                            priceParse = values.price;
                        }

                        if (!Number.isInteger(values.completionTime)) {
                            completionTimeParse = parseInt(values.completionTime.replace(/[^0-9]/g, ''));
                        } else {
                            completionTimeParse = values.completionTime;
                        }

                        if (!Number.isInteger(values.qtyPerDay)) {
                            qtyPerDayParse = parseInt(values.qtyPerDay.replace(/[^0-9]/g, ''));
                        } else {
                            qtyPerDayParse = values.qtyPerDay;
                        }

                        const modifiedItem = {
                            ...values,
                            price: priceParse,
                            completionTime: completionTimeParse,
                            qtyPerDay: qtyPerDayParse,
                        };
                        console.log(modifiedItem);
                        const result = dispatch(updateDishAdmin(modifiedItem));
                        const status = Utils.getValues(result, 'error.code', []);

                        if (status === 'ERR_BAD_REQUEST') {
                            UseNotification.Message.FinishFailMessage(t, UserAction.UpdateFinishFail);
                            setOpenEditModel(false);
                        } else {
                            UseNotification.Message.FinishMessage(t, UserAction.UpdateFinish);
                            setOpenEditModel(false);
                            fetchData();
                        }
                    })
                    .then(() => editForm.resetFields());
            })
            .catch(() => {
                UseNotification.Message.FinishFailMessage(t, UserAction.UpdateFinishFail);
            });
    };

    const handleRefreshClick = (index) => {
        fetchData();
    };

    const containerProps = {
        ...props,
        history,
        t,
        columns,
        tableData,
        openCreateModel,
        openEditModel,
        createForm,
        editForm,
        messageContextHolder,
        loadingsRefreshButton,
        defaultFile,
        handleActionButtonEditClick,
        handleActionButtonDeleteClick,
        handleActionButtonTurnOffClick,
        handleActionButtonTurnOnClick,
        handleCreateSubmitClick,
        handleEditSubmitClick,
        handleEditCancelClick,
        handleCreateCancelClick,
        expandedRowRenderSelection,
        handleCreateNewClick,
        handleRefreshClick,
    };
    return <MainView {...propsProvider(containerProps)} />;
}

export default Conainer;
