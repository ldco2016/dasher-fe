// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const data = [
    {
      sectionName: 'RPM',
      title: 'Remote Physiologic Monitoring (RPM)',
      content: [
        {
          title: 'CPT Code Definitions and Requirements',
          format: 'cpt',
          list: [
            {
              code: 99453,
              codeDescription: 'CYCLE: EVERY 30 DAYS',
              title: 'Onboarding – data transmission and patient education',
              description:
                'Patient must record a minimum of 16 days of spirometry readings, within 30 days, in order to qualify for billing. May be billed once per episode of care.',
            },
            {
              code: 99454,
              codeDescription: 'CYCLE: EVERY 30 DAYS',
              title: 'Data transmission',
              description:
                'Patient must record a minimum of 16 days of spirometry readings, within 30 days, in order to qualify for billing. If patient has a COVID diagnosis, only 2 days of recordings are required.',
            },
            {
              code: 99457,
              codeDescription: 'PRIMARY CODE / CYCLE: EACH CALENDAR MONTH',
              title: 'Data interpretation and care management',
              description:
                'Patient must record a minimum of 16 days of spirometry readings, within 30 days, in order to qualify for billing. May be billed once per episode of care.',
            },
            {
              code: 99453,
              codeDescription: 'CYCLE: EVERY 30 DAYS',
              title: 'Onboarding – data transmission and patient education',
              description:
                'Patient must record a minimum of 16 days of spirometry readings, within 30 days, in order to qualify for billing. May be billed once per episode of care.',
            },
          ],
        },
        {
          title: 'Frequently Asked Questions',
          format: 'faq',
          list: [
            {
              question: 'Question one?',
              answer: 'answer1',
            },
            {
              question: 'Question two?',
              answer: 'answer2',
            },
            {
              question: 'Question three?',
              answer: 'answer3',
            },
          ],
        },
      ],
    },

    {
      sectionName: 'PCM',
      title: 'PCM title...',
      content: [
        {
          title: 'PCM subtitle',
          format: 'pcm',
          list: [
            {
              title: 'Test Title PCM',
              description: 'Lorem ipsum sed dolor amet',
            },
            {
              title: 'Test Title',
              description: 'Lorem ipsum sed dolor amet',
            },
          ],
        },
        {
          title: 'Frequently Asked Questions',
          format: 'faq',
          list: [
            {
              question: 'Question one?',
              answer: 'answer1',
            },
            {
              question: 'Question two?',
              answer: 'answer2',
            },
            {
              question: 'Question three?',
              answer: 'answer3',
            },
          ],
        },
      ],
    },
    {
      sectionName: 'General',
      title: 'General title...',
      content: [
        {
          title: 'General subtitle',
          format: 'general',
          list: [
            {
              title: 'Test Title General',
              codeDescription: 'Test Description',
              description: 'Lorem ipsum sed dolor amet',
            },
            {
              title: 'Test Title',
              codeDescription: 'Test Description',
              description: 'Lorem ipsum sed dolor amet',
            },
          ],
        },
      ],
    },
  ]

  res.status(200).json(data)
}
