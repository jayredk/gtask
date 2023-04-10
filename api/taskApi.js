import client from './api-client'

export const getTasks = ({page = 1, sortCreated = 'desc', labels = [], accessToken }) => {
  return client(`issues?page=${page}&per_page=10&direction=${sortCreated}&labels=${labels.toString()}`, {
    method: 'GET',
    headers: {
      accept: 'application/vnd.github+json',
      Authorization: `Bearer ${accessToken}`
    }
  })
}

export const searchTasks = ({ userName = '', searchInput, accessToken }) => {
  return client(`search/issues?q=assignee:${userName}+${searchInput}`, {
    method: 'GET',
    headers: {
      accept: 'application/vnd.github+json',
      Authorization: `Bearer ${accessToken}`
    }
  })
}