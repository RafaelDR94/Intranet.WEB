import clsx from 'clsx'

import { dropzoneBaseClasses } from '@/app/components/ImageUploaderExpanded/styles'

export const ticketFormContainer = 'flex w-full flex-col gap-6'

export const ticketFormDropzoneClasses = clsx(
  dropzoneBaseClasses,
  'w-full min-h-[260px] bg-white'
)
