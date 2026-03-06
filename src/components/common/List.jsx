import { Fragment } from 'react'

import ProgressGradient from '../ui/ProgressGradient'

import EmptyState from './EmptyState'

/**
 * @description List component
 
 * @param {object} props
 * @param {Array} props.items
 * @param {boolean} props.isLoading
 * @param {Function} props.renderItem
 * @param {string} props.className
 * @param {React.Component} props.loadingComponent
 * @param {React.Component} props.emptyComponent
 * @param {('scrollable' | 'tags' | 'default')} props.typeList
 * @param {React.Ref} props.ref
 * @returns {React.ReactNode}
 */

function List({
  items = [],
  isLoading = false,
  renderItem,
  className,
  emptyComponent: EmptyComponent,
  typeList = 'video',
  ref,
}) {

  const Empty = EmptyComponent ?? EmptyState

  return (
    <>
      {isLoading
        ? <ProgressGradient className="list--loading" isLoading={isLoading} />
        : items?.length === 0 && Array.isArray(items)
          ? <div className="list__empty">
            <Empty />
          </div>
          :
          <ul
            className={`list list--${typeList} ${className}`}
            ref={ref}
          >
            {items.map((item, index) => (
              <Fragment key={item?.id ?? index}>
                {renderItem(item, index)}
              </Fragment>
            ))}
          </ul>
      }
    </>
  )
}

export default List
