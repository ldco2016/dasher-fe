import React, { useState, useRef } from 'react'
import { styled } from '@mui/system'
import PhoneNumberField from '../forms/PhoneNumberField'
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Divider,
  Button,
  Box,
  FormControlLabel,
  Checkbox,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { useTheme } from '@mui/material/styles'
import AddIcon from '@mui/icons-material/Add'
import { useForm, Controller, FormProvider } from 'react-hook-form'
import ControlledTextField from '../forms/ControlledTextField'
import UserCard from 'components/clinics/UserCard'

// TODO: refactor token into useFetch
import fetch from 'libs/fetch'
import useSWR from 'swr'
import fetchWithToken from 'libs/fetchWithToken'

import { IAddStaff, GeneralObject } from 'types'
import env from '@beam-australia/react-env'

const Form = styled('form')(({ theme }) => ({
  width: '100%', // Fix IE 11 issue.
  marginTop: 1,
  flexGrow: 1,
}))

const CustomInputLabel = styled(InputLabel)(({ theme }) => ({
  transform: 'translate(14px, 8px) scale(1)',
  '&[data-shrink="true"]': {
    transform: 'translate(14px, -9px) scale(0.75)',
  },
}))

const ClinicSelect = ({ clinic, handleChange }: IAddStaff) => {
  const theme = useTheme()
  const [staffFormActive, setStaffFormActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userRole, setUserRole] = useState('')
  const [revenueProjection, setRevenueProjection] = useState(false)
  const [billingAccess, setBillingAccess] = useState(false)

  const methods = useForm({ mode: 'onChange' })

  const accountsRef = useRef<any>()

  // TODO: when/if this component is added back into the UI
  // use the new token fetching hook:
  // const { data, error } = useSWRWithToken(`/api/endpoint`)
  const { data: token } = useSWR<any>(`/api/get-token/`, fetch)

  const { data: roles, error } = useSWR<any>(
    `${env('PUBLIC_ALUNA_API')}/auth/roles`,
    fetchWithToken,
    {
      dedupingInterval: 3600000,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  // TODO: when/if this component is added back into the UI
  // use the new token fetching hook:
  // const { data, error } = useSWRWithToken(`/api/endpoint`)
  const {
    data: invitations,
    error: invitationsError,
    mutate: mutateInvitations,
  } = useSWR<any>(
    `${env('PUBLIC_ALUNA_API')}/organizations/${clinic?.poi}/invitations`,
    fetchWithToken
  )

  console.log('invitations: ', invitations)

  const toggleStaffFormActive = () => {
    setStaffFormActive(!staffFormActive)
    setUserRole('')
    setBillingAccess(false)
    setRevenueProjection(false)

    methods.reset({
      title: '',
      email: '',
      firstName: '',
      middleName: '',
      lastName: '',
      phone: null,
      npi: null,
      roleIds: [],
      groupId: '',
      billingAccess: false,
      revenueProjection: false,
    })
  }
  const handleChangeUserRole = (e) => {
    console.log('e: ', e.target.value)
    setUserRole(e.target.value)
  }

  const editInvite = (user) => {
    console.log('user: ', user)
    const {
      title,
      email,
      firstName,
      middleName,
      lastName,
      phone,
      npi,
      assignedRoleCode,
    } = user.viewHealthWorkerDto

    const _billingAccess = user.invitationTags.filter(
      (obj) => obj.key === 'billingAccess'
    )[0]?.value

    const _revenueProjection = user.invitationTags.filter(
      (obj) => obj.key === 'revenueProjection'
    )[0]?.value

    setUserRole(assignedRoleCode)
    setBillingAccess(_billingAccess === 'true' ? true : false)
    setRevenueProjection(_revenueProjection === 'true' ? true : false)

    methods.reset({
      title,
      email,
      firstName,
      middleName,
      lastName,
      phone,
      npi,
      roleIds: [userRole],
      groupId: clinic?.poi,
      billingAccess,
      revenueProjection,
    })

    setStaffFormActive(true)
    accountsRef?.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const onSubmit = async (data) => {
    console.log('data==: ', data)
    setLoading(true)

    const {
      title,
      firstName,
      middleName,
      lastName,
      email,
      phoneStripped,
      npi,
      billingAccess,
      revenueProjection,
    } = data

    // TODO: make roleIds part of multiselect
    // TODO: unmount component when drawer closes
    const formData = {
      title,
      firstName,
      middleName,
      lastName,
      email,
      phone: phoneStripped,
      npi,
      roleIds: [userRole],
      groupId: clinic?.poi,
      invitationTags: [
        {
          key: 'billingAccess',
          value: billingAccess ? true : false,
        },
        {
          key: 'revenueProjection',
          value: revenueProjection ? true : false,
        },
      ],
    }

    // Optimistically update
    mutateInvitations((invitations) => {
      return [
        ...invitations,
        {
          roleDescription: '--',
          viewHealthWorkerDto: {
            title,
            email,
            firstName,
            middleName,
            lastName,
            phone: phoneStripped,
          },
        },
      ]
    }, false)

    console.log('formData: ', formData)

    // TODO: move to axios
    const userInvite = await fetch(`${env('PUBLIC_ALUNA_API')}/invitations`, {
      method: 'POST',
      headers: new Headers({
        Authorization: `Bearer ${token?.accessToken}`,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(formData),
    })
      .then((result) => {
        console.log('result', result)
        setStaffFormActive(false)
      })
      .catch((error) => console.log('error', error))

    setLoading(false)
  }

  // There can only ever be one admin user
  const adminUser = invitations?.filter(
    (obj) => obj.roleDescription === 'admin'
  )

  adminUser && console.log('adminUser: ', adminUser[0])

  return (
    <>
      <Typography variant="h1" sx={{ mb: 2 }}>
        {clinic?.name}
      </Typography>

      <Typography variant="h2" sx={{ mb: 1 }} display="inline">
        <b>Tax ID Number</b>&nbsp;&nbsp;
        <Typography variant="body2" display="inline">
          {clinic?.ein || 'n/a'}
        </Typography>
      </Typography>
      {adminUser && (
        <Typography variant="h2" display="inline">
          <b>Admin Provider's NPI</b>&nbsp;&nbsp;
          <Typography variant="body2" display="inline">
            {adminUser[0]?.viewHealthWorkerDto?.npi || 'n/a'}
          </Typography>
        </Typography>
      )}
      <Divider sx={{ mt: 2, mb: 2 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography
          variant="h2"
          sx={{ lineHeight: theme.spacing(4) }}
          display="inline"
          ref={accountsRef}
        >
          Staff Accounts
        </Typography>

        <Button
          size="small"
          onClick={toggleStaffFormActive}
          startIcon={staffFormActive ? null : <AddIcon />}
          fullWidth={false}
        >
          {staffFormActive ? 'Cancel' : 'Add Staff'}
        </Button>
      </Box>

      {staffFormActive && (
        <>
          <FormProvider {...methods}>
            <Form
              noValidate
              method="post"
              onSubmit={methods.handleSubmit(onSubmit)}
            >
              <Box
                sx={{
                  p: theme.spacing(2),
                  backgroundColor: theme.palette.grey[100],
                  mb: 2,
                }}
              >
                <Box sx={{ display: 'flex' }}>
                  <ControlledTextField
                    name="title"
                    label="Title"
                    sx={{ mr: 1.5 }}
                    required={false}
                  />
                  <ControlledTextField
                    name="firstName"
                    label="First Name"
                    rules={{ required: 'first name required' }}
                    sx={{ mr: 1.5, minWidth: '115px' }}
                  />
                  <ControlledTextField
                    name="middleName"
                    label="Middle Name"
                    required={false}
                  />
                </Box>

                <ControlledTextField
                  name="lastName"
                  label="Last Name"
                  rules={{
                    required: 'last name required',
                  }}
                />
                <ControlledTextField
                  name="email"
                  label="Email"
                  rules={{
                    required: 'Email required',
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: 'Entered value does not match email format',
                    },
                  }}
                />

                <PhoneNumberField name="phone" label="Phone Number" />

                <ControlledTextField
                  name="npi"
                  label="NPI"
                  type="number"
                  required={false}
                  rules={{
                    minLength: { value: 10, message: 'must be 10 digits' },
                    maxLength: {
                      value: 10,
                      message: "can't be more than 10 digits",
                    },
                  }}
                />
                {/* TODO: make this a multiselect */}
                <FormControl sx={{ mt: 1, mb: 2, width: '100%' }}>
                  <CustomInputLabel htmlFor="role-select-label">
                    User Role
                  </CustomInputLabel>
                  <Select
                    labelId="role-select-label"
                    id="userRole"
                    value={userRole}
                    label="User Role"
                    size="small"
                    required={true}
                    onChange={handleChangeUserRole}
                  >
                    {roles?.map((role, index) => {
                      return (
                        <MenuItem key={index} value={role.name}>
                          {role.description}
                        </MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2">Optional Access</Typography>
                  <Controller
                    control={methods.control}
                    name="billingAccess"
                    render={({ field: { onChange } }) => (
                      <FormControlLabel
                        onChange={onChange}
                        sx={{ mr: '12px' }}
                        control={
                          <Checkbox
                            checked={billingAccess}
                            name="billingAccess"
                            onChange={() => {
                              setBillingAccess(!billingAccess)
                            }}
                          />
                        }
                        label={<>Billing Access</>}
                      />
                    )}
                  />
                  &nbsp;
                  <Controller
                    control={methods.control}
                    name="revenueProjection"
                    render={({ field: { onChange } }) => (
                      <FormControlLabel
                        onChange={onChange}
                        control={
                          <Checkbox
                            checked={revenueProjection}
                            name="revenueProjection"
                            onChange={() => {
                              setRevenueProjection(!revenueProjection)
                            }}
                          />
                        }
                        label={<>Revenue Projection</>}
                      />
                    )}
                  />
                </Box>

                <LoadingButton
                  loading={loading}
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Send Invitation
                </LoadingButton>
              </Box>
            </Form>
          </FormProvider>
        </>
      )}

      {/* {clinic?.users?.map((user) => {
        return <UserCard key={user.pui} user={user} editInvite={editInvite} />
      })} */}

      {invitations?.map((userInvitation) => {
        console.log
        return (
          <UserCard
            key={userInvitation.pui}
            user={userInvitation}
            editInvite={editInvite}
          />
        )
      })}
    </>
  )
}

export default ClinicSelect
