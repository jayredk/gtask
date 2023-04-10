import client from './api-client'

export const getTasks = ({page = 1, sortCreated = 'desc', labels = [], accessToken, signal }) => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/vnd.github+json',
      Authorization: `Bearer ${accessToken}`
    }
  }

  if (signal) options.signal = signal;

  return client(`issues?page=${page}&per_page=10&direction=${sortCreated}&labels=${labels.toString()}`, options)
}

export const searchTasks = ({ userName = '', searchInput, accessToken, signal }) => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/vnd.github+json',
      Authorization: `Bearer ${accessToken}`
    }
  };

  if (signal) options.signal = signal;

  return client(`search/issues?q=assignee:${userName}+${searchInput}`, options
  )
}