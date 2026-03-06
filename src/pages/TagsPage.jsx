import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

import EmptyState from '../components/common/EmptyState'
import List from '../components/common/List'
import TagFormModal from '../components/tags/TagFormModal'
import TagRemoveModal from '../components/tags/TagRemoveModal'
import TagRow from '../components/tags/TagRow'
import CreateButton from '../components/ui/CreateButton'
import Heading from '../components/ui/Heading'
import ProgressGradient from '../components/ui/ProgressGradient'
import useBreakpoint from '../hooks/useBreakpoint'
import { createTag } from '../services/tags/createTag'
import { deleteTag } from '../services/tags/deleteTag'
import { getTags } from '../services/tags/getTags'
import { updateTag } from '../services/tags/updateTag'

function TagsPage() {
  const [isOpenForm, setIsOpenForm] = useState(false)
  const [editingTag, setEditingTag] = useState(null)
  const [removingTag, setRemovingTag] = useState(null)
  const { isPhone } = useBreakpoint()

  const { t } = useTranslation()
  const TITLE = t('TITLE', { returnObjects: true })
  const TAGS_PAGE = t('TAGS_PAGE', { returnObjects: true })

  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: () => getTags(),
    select: (resp) => resp?.data ?? {},
    refetchOnWindowFocus: false,
  })

  const tags = Array.isArray(data?.tags) ? data.tags : data ?? []

  const { mutateAsync: createTagMutation, isPending: isCreatePending } = useMutation({
    mutationFn: (payload) => createTag(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tags'] })
  })

  const { mutateAsync: updateTagMutation, isPending: isUpdatePending } = useMutation({
    mutationFn: ({ id, name, color }) => updateTag(id, { name, color }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tags'] })
  })

  const { mutateAsync: removeTagMutation, isPending: isRemovePending } = useMutation({
    mutationFn: (id) => deleteTag(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tags'] })
  })

  const openCreate = () => { setEditingTag(null); setIsOpenForm(true) }
  const openEdit = (tag) => { setEditingTag(tag); setIsOpenForm(true) }
  const openRemove = (tag) => { setRemovingTag(tag) }

  const handleSubmit = async ({ name, color }, { setSubmitting }) => {
    setSubmitting(true)
    const mutation = editingTag?.id ? updateTagMutation : createTagMutation

    mutation({ id: editingTag?.id, name, color }, {
      onSuccess: () => {
        setIsOpenForm(false)
        setEditingTag(null)

        if (editingTag?.id) {
          return toast.success(TAGS_PAGE.TOAST.EDIT_SUCCESS)
        }
        toast.success(TAGS_PAGE.TOAST.CREATE_SUCCESS)
      },
      onError: () => {
        if (editingTag?.id) {
          return toast.error(TAGS_PAGE.TOAST.EDIT_ERROR)
        }
        toast.error(TAGS_PAGE.TOAST.CREATE_ERROR)
      },
      onSettled: () => {
        setSubmitting(false)
      },
    })
  }

  const handleRemove = () => {
    removeTagMutation(removingTag?.id, {
      onSuccess: () => {
        setRemovingTag(null)
        toast.success(TAGS_PAGE.TOAST.DELETE_SUCCESS)
      },
      onError: () => {
        toast.error(TAGS_PAGE.TOAST.DELETE_ERROR)
      },
    })
  }

  const editValues = {
    name: editingTag?.name ?? '',
    color: editingTag?.color ?? '#000000',
  }

  return (
    <div className="tags-page">
      <Heading title={TITLE.MAIN} as="h1" />
      <div className="tags-page__main">
        <Heading title={TAGS_PAGE.TITLE} as="h2" className="tags-page__heading" >
          {(!isPhone || (isPhone && !isLoading)) &&
            <CreateButton
              label={TAGS_PAGE.ADD}
              onClick={openCreate}
            />
          }
        </Heading>
        {isLoading ? (
          <ProgressGradient className="tags-page__progress" isLoading={isLoading} />
        ) : Array.isArray(tags) && tags?.length > 0 ? (
          <div className="tags-page__table">
            <List
              typeList="tags"
              isLoading={isLoading}
              items={tags}
              renderItem={(tag) => (
                <TagRow
                  key={tag?.id}
                  tag={tag}
                  onEdit={openEdit}
                  onRemove={openRemove}
                />
              )}
            />
          </div>
        ) : (
          <div className="tags-page__empty">
            <EmptyState />
          </div>
        )}

      </div>

      {isOpenForm && (
        <TagFormModal
          initialValues={editValues}
          isEdit={Boolean(editingTag?.id)}
          onClose={setIsOpenForm}
          onSubmit={handleSubmit}
          isPending={isCreatePending || isUpdatePending}
        />
      )}

      {Boolean(removingTag) && (
        <TagRemoveModal
          tag={removingTag}
          onCancel={() => setRemovingTag(null)}
          onConfirm={handleRemove}
          isPending={isRemovePending}
        />
      )}
    </div>
  )
}

export default TagsPage
