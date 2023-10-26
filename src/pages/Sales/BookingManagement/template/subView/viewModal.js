import { Modal } from 'antd';
import { FormBuilder } from '../../../../../components/FormBuilder';

export default function ViewModal({
    t,
    viewData,
    openViewModel,
    handleViewCancelClick,
    handleCreateSubmitClick,
    messageContextHolder,
}) {
    const target = t('main.common.system_key.booking');
    return (
        <>
            <Modal
                open={openViewModel}
                title={t('main.entities.form_view_title', {
                    target: target,
                })}
                onCancel={handleViewCancelClick}
                maskClosable={false}
                footer={[]}
                centered
                width='50%'
            >
                {messageContextHolder}
                <FormBuilder.ViewBookingForm
                    viewData={viewData}
                    handleButtonSubmit={handleCreateSubmitClick}
                    handleButtonCancel={handleViewCancelClick}
                />
            </Modal>
        </>
    );
}