import React, { useEffect, useState, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { SearchIcon } from '@heroicons/react/outline'

import Input from 'ui/Input'
import Dropdown from 'ui/Dropdown'
import ExtensionsCard from 'components/ExtensionsCard'
import Pagination from 'ui/Pagination'
import Loader from 'ui/Loader'

import { sortByConstans } from 'redux/constants'

import _values from 'lodash/values'
import _map from 'lodash/map'
import _ceil from 'lodash/ceil'
import _isEmputy from 'lodash/isEmpty'

import { getExtensionsSearch } from 'api'

const Search = ({
  limit, offset, setOffset, category,
}) => {
  const params = new URLSearchParams(window.location.search)

  const [search, setSearch] = useState(params.get('term'))
  const [filterCategory, setFilterCategory] = useState(params.get('category'))
  const [filterSortBy, setFilterSortBy] = useState(params.get('sortBy'))
  const [extensions, setExtensions] = useState()
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState((offset / limit) + 1)
  // eslint-disable-next-line no-unsafe-optional-chaining
  const [total, setTotal] = useState(0)
  const pageAmount = useMemo(() => (_ceil(total / limit)), [total, limit])

  const history = useHistory()

  const getExtensions = async () => {
    setLoading(true)
    await getExtensionsSearch(search, filterCategory, filterSortBy, offset, limit)
      .then(results => {
        setExtensions(results.extensions)
        setTotal(results.count)
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    setOffset((page - 1) * limit)
  }, [page, limit, setOffset])

  useEffect(() => {
    getExtensions()
  }, [search, filterCategory, filterSortBy, offset, limit])

  useEffect(() => {
    history.push(`/search?term=${search}&category=${_isEmputy(filterCategory) ? '' : filterCategory}&sortBy=${filterSortBy}`)
  }, [search, filterCategory, filterSortBy, history])

  return (
    <div className='dark:bg-gray-900 py-10 px-2 sm:px-10'>
      <div className='mx-auto max-w-7xl'>
        <form className='flex rounded-md shadow-sm !max-w-[360px] !w-full' onSubmit={() => {}}>
          <Input
            type='text'
            label=''
            value={search}
            placeholder='Search extensions for Swetrix Analytics'
            classNameInpit='!rounded-none !rounded-l-md'
            className='!w-full !max-w-full'
            onChange={(e) => setSearch(e.target.value)}
            disabled={false}
            error={false}
          />
          <button
            type='submit'
            className='-ml-px mb-2 mt-1 relative inline-flex items-center space-x-2 px-4 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 dark:bg-gray-800 dark:border-0 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500'
          >
            <SearchIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
          </button>
        </form>
        <div className='flex items-center justify-between mt-8'>
          <div>
            <span className='text-gray-500 dark:text-gray-300 text-lg font-medium'>1538 Results</span>
          </div>
          <div className='flex items-center justify-between'>
            <div className='mr-5'>
              <span className='mr-3 dark:text-gray-200'>Showing:</span>
              <Dropdown
                items={_values(category)}
                title={filterCategory}
                buttonClassName='flex items-center w-full rounded-md border border-gray-300 shadow-sm px-1 md:px-2 py-1 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500 dark:text-gray-50 dark:border-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600'
                selectItemClassName='text-gray-700 block px-2 py-1 text-base cursor-pointer hover:bg-gray-200 dark:text-gray-50 dark:border-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600'
                onSelect={setFilterCategory}
              />
            </div>
            <div>
              <span className='mr-3  dark:text-gray-200'>Sort By:</span>
              <Dropdown
                items={_values(sortByConstans)}
                title={filterSortBy}
                buttonClassName='flex items-center w-full rounded-md border border-gray-300 shadow-sm px-1 md:px-2 py-1 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500 dark:text-gray-50 dark:border-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600'
                selectItemClassName='text-gray-700 block px-2 py-1 text-base cursor-pointer hover:bg-gray-200 dark:text-gray-50 dark:border-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600'
                onSelect={setFilterSortBy}
              />
            </div>
          </div>
        </div>
        <div className='flex items-center flex-wrap justify-center md:justify-between mt-4 gap-1'>
          {loading
            ? (
              <div className='mx-auto'>
                <Loader />
              </div>
            )
            : _map(extensions, ((item) => (
              <ExtensionsCard key={item.id} name={item.name} stars={4} downloads={1000} price={item.price} companyLink='swetrix' companyName='companyName' mainImage={item.mainImage} />
            )))}
        </div>
        {pageAmount > 1 && (
          <div className='mt-2'>
            <Pagination page={page} setPage={setPage} pageAmount={pageAmount} total={total} />
          </div>
        )}
      </div>
    </div>
  )
}

export default Search
