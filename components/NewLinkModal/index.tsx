import { useRef } from 'react';
import { NewLinkModalType } from '../../types';
import { Modal } from '@components/Modal';
import { LiveRegion } from '@components/LiveRegion';
import { ModalInput } from '@components/ModalInput';
import { DialogButton } from '@components/DialogButton';
import { linkInputs, topicInputs } from '@lib/client';
import { useFormHandler } from '@lib/client/hooks/useFormHandler';
import { useLiveRegion } from '@lib/client/hooks/useLiveRegion';
import { TagsList } from './TagList';

export type ModalContainerProps = {
  open: boolean;
  handleOpenModal: (open: boolean) => void;
  type: NewLinkModalType;
  topicId?: string;
};

export const NewLinkModal = ({
  open,
  handleOpenModal,
  topicId,
  type,
}: ModalContainerProps) => {
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const { announce, announcement } = useLiveRegion({});
  const {
    submit,
    handleAddTag,
    handleRemoveTag,
    handleClearError,
    error,
    tags,
  } = useFormHandler({
    type,
    topicId,
    announce,
  });

  const handleAddResource = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isSubmissionSuccessful = await submit(e);

    if (isSubmissionSuccessful) {
      handleOpenModal(false);
    }
  };

  const inputs = type === 'link' ? linkInputs : topicInputs;
  const title =
    type === 'topic' ? 'Insert a new topic' : 'Add new article/resource';

  return (
    <Modal open={open} handleOpenModal={handleOpenModal} title={title}>
      <form
        data-testid='resource-form'
        onSubmit={handleAddResource}
        onInput={handleClearError}
      >
        <div className='flex flex-col gap-4'>
          {inputs.map(({ name }) => (
            <ModalInput
              key={name}
              name={name}
              errorMessage={error}
              handleKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const tagValue = (e.target as HTMLInputElement).value;
                  handleAddTag(tagValue);
                }
              }}
            />
          ))}
        </div>

        {type === 'link' && tags.length > 0 && (
          <TagsList
            tags={tags}
            onRemoveTag={handleRemoveTag}
            submitButtonRef={submitButtonRef}
          />
        )}

        <div className='border-slate-100 flex items-center justify-between sm:flex-row-reverse'>
          <DialogButton
            text='+'
            ariaLabel={`Add ${type}`}
            ref={submitButtonRef}
          />

          <LiveRegion liveRegionContent={announcement} />
        </div>
      </form>
    </Modal>
  );
};
