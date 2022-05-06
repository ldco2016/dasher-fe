import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { FormProvider, useForm } from 'react-hook-form'
import PhoneNumberField from '../components/forms/PhoneNumberField'

export default {
  title: 'Phone Number Field',
  component: PhoneNumberField,
} as ComponentMeta<typeof PhoneNumberField>

const Template: ComponentStory<typeof PhoneNumberField> = (args) => {
  const methods = useForm({
    defaultValues: { phone: 5555555555 },
    mode: 'onChange',
  })
  const { handleSubmit } = methods

  const onSubmit = (data) => {
    console.log(data)
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <PhoneNumberField {...args} />
      </form>
    </FormProvider>
  )
}

export const Default = Template.bind({})

Default.args = {
  name: 'phone',
  label: 'Phone Number',
}
