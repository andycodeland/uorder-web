import { Form, message, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import TableColumns from '../../../components/CustomTable/columnConfigs';
import { hideLoading, showLoading } from '../../../components/FullPageLoading/LoadingSlice';
import { NotificationTarget, UseNotification } from '../../../components/UseNotification';
import Utils from '../../../utilities';
import { updateDishStatusAdmin } from '../DishManagement/Slice';
import propsProvider from './PropsProvider';
import {
    createMenuAdmin,
    deleteMenuAdmin,
    getListMenuAdmin,
    removeMenuAdmin,
    undoDeleteMenuAdmin,
    updateMenuAdmin,
    updateMenuStatusAdmin,
} from './Slice';
import MainView from './template/MainView';

function Conainer(props) {
    const { history, t, dispatch } = props;
    const columns = TableColumns.MenuColumns(t);
    const [tableData, setTableData] = useState([]);
    const [createForm] = Form.useForm();
    const [editForm] = Form.useForm();
    const [openCreateModel, setOpenCreateModel] = useState(false);
    const [openEditModel, setOpenEditModel] = useState(false);
    const [messageApi, messageContextHolder] = message.useMessage();
    const [deleteAlert, setDeleteAlert] = useState({ data: null, timestamp: 0 });

    const fetchData = async () => {
        dispatch(showLoading());
        try {
            await dispatch(getListMenuAdmin()).then((result) => {
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

    const handleEditCancelClick = () => {
        setOpenEditModel(false);
    };

    const handleCreateCancelClick = () => {
        setOpenCreateModel(false);
    };

    const handleActionButtonEditClick = (data) => {
        editForm.setFieldsValue({ ...data });
        setOpenEditModel(true);
    };

    const handleActionButtonDeleteClick = (data) => {
        async function onOk() {
            await dispatch(deleteMenuAdmin(data.id))
                .then((result) => {
                    const timestamp = Utils.getValues(result, 'payload', []);
                    setDeleteAlert({ data: data, timestamp: timestamp });
                })
                .then(() => {
                    fetchData();
                });
        }
        Modal.confirm(UseNotification.Modal.DeleteModal(t, NotificationTarget.Menu, onOk));
    };

    const handleActionButtonTurnOffClick = (data) => {
        async function onOk() {
            await dispatch(
                updateMenuStatusAdmin([
                    {
                        path: '/IsActive',
                        op: 'replace',
                        value: false,
                        id: data.id,
                    },
                ]),
            ).then(() => fetchData());
        }
        Modal.confirm(UseNotification.Modal.TurnOffModal(t, NotificationTarget.Menu, onOk));
    };

    const handleActionButtonTurnOnClick = (data) => {
        async function onOk() {
            await dispatch(
                updateMenuStatusAdmin([
                    {
                        path: '/IsActive',
                        op: 'replace',
                        value: true,
                        id: data.id,
                    },
                ]),
            ).then(() => fetchData());
        }
        Modal.confirm(UseNotification.Modal.TurnOnModal(t, NotificationTarget.Menu, onOk));
    };

    const handleQuickDeleteConfirm = async (data) => {
        await dispatch(removeMenuAdmin({ dishId: data.id, menuId: data.parentId })).then(() => fetchData());
    };

    const handleUndoDeleteClick = async () => {
        await dispatch(undoDeleteMenuAdmin(deleteAlert.data.id))
            .then(() => {
                setDeleteAlert({});
            })
            .then(() => fetchData());
    };

    const handleQuickTurnOffConfirm = async (data) => {
        await dispatch(
            updateDishStatusAdmin([
                {
                    path: '/IsActive',
                    op: 'replace',
                    value: false,
                    id: data.id,
                },
            ]),
        ).then(() => fetchData());
    };

    const handleQuickActionButtonTurnOnClick = async (data) => {
        await dispatch(
            updateDishStatusAdmin([
                {
                    path: '/IsActive',
                    op: 'replace',
                    value: true,
                    id: data.id,
                },
            ]),
        ).then(() => fetchData());
    };

    const handleCreateSubmitClick = (values) => {
        createForm
            .validateFields()
            .then(() => {
                messageApi
                    .open(UseNotification.Message.InProgressMessage(t))
                    .then(async () => {
                        await dispatch(createMenuAdmin(values)).then(() => {
                            UseNotification.Message.CreateFinish(t);
                            setOpenCreateModel(false);
                            fetchData();
                        });
                    })
                    .then(() => createForm.resetFields());
            })
            .catch(() => {
                UseNotification.Message.CreateFinishFail(t);
            });
    };

    const handleEditSubmitClick = (values) => {
        editForm
            .validateFields()
            .then(() => {
                messageApi
                    .open(UseNotification.Message.InProgressMessage(t))
                    .then(async () => {
                        let modifiedItem = {
                            ...values,
                        };
                        if (values.dishes && values.dishes[0].hasOwnProperty('key')) {
                            modifiedItem = {
                                ...values,
                                dishes: values.dishes.map((item) => item.id),
                            };
                        }
                        const result = await dispatch(updateMenuAdmin(modifiedItem));
                        const status = Utils.getValues(result, 'error.code', []);

                        if (status === 'ERR_BAD_REQUEST') {
                            UseNotification.Message.UpdateFinishFail(t);
                            setOpenEditModel(false);
                        } else {
                            UseNotification.Message.UpdateFinish(t);
                            setOpenEditModel(false);
                            fetchData();
                        }
                    })
                    .then(() => editForm.resetFields());
            })
            .catch(() => {
                UseNotification.Message.UpdateFinishFail(t);
            });
    };

    const handleCreateNewClick = () => {
        setOpenCreateModel(true);
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
        handleActionButtonEditClick,
        handleActionButtonDeleteClick,
        handleActionButtonTurnOffClick,
        handleActionButtonTurnOnClick,
        handleCreateSubmitClick,
        handleEditSubmitClick,
        handleEditCancelClick,
        handleCreateCancelClick,
        handleQuickTurnOffConfirm,
        handleQuickDeleteConfirm,
        handleQuickActionButtonTurnOnClick,
        handleCreateNewClick,
        handleRefreshClick,
        deleteAlert,
        handleUndoDeleteClick,
        setDeleteAlert,
    };
    return <MainView {...propsProvider(containerProps)} />;
}

export default Conainer;
