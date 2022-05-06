import React, { useState } from 'react'
import { Typography, Divider, Pagination } from '@mui/material'
import useSWRWithToken from 'hooks/useSWRWithToken'
import { styled } from '@mui/system'
import { data } from 'cypress/types/jquery'

const FeedbackList = styled('ul')(({ theme }) => ({
  listStyle: 'none',
  margin: 0,
  padding: 0,

  '& li': {
    marginBottom: theme.spacing(3),
  },
}))

const Feedback = () => {
  const [page, setPage] = useState(0)

  const { data: feedback } = useSWRWithToken([
    `/feedback`,
    {
      page,
      size: 10,
    },
  ])

  const handleChange = (_, value: number) => {
    setPage(value - 1)
  }

  if (feedback) {
    console.log('feedback: ', feedback)
    console.log('feedback.number: ', feedback.number)
    console.log('feedback.totalPages: ', feedback.totalPages)
  }
  return (
    <>
      <Typography variant="h1" sx={{ mb: 3 }}>
        Customer Feedback
      </Typography>

      {feedback && (
        <>
          <Divider sx={{ mb: 3 }} />
          <Pagination
            count={feedback.totalPages}
            page={feedback.number + 1}
            onChange={handleChange}
          />

          <FeedbackList>
            {feedback.content.map((item, index) => {
              return (
                <li key={index}>
                  <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.9em' }}>
                    {JSON.stringify(item, null, 2)}
                  </pre>
                </li>
              )
            })}
          </FeedbackList>
        </>
      )}
    </>
  )
}

Feedback.layout = 'default'
Feedback.auth = true

export default Feedback
