import React, { useState } from 'react'
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Paper,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContentText,
  DialogContent,
  Dialog,
} from '@mui/material'
import {
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Checkbox,
  FormControlLabel,
} from '@mui/material'
import FullScreenColumn from 'components/pageLayout/FullScreenColumn'
import { styled, useTheme } from '@mui/system'
import { useForm, Controller } from 'react-hook-form'
import AlunaLogo from 'public/images/logo_white.svg'
import LegalCopy from 'components/forms/LegalCopy'
import { Link } from '@mui/material'
import CustomerInformationStep from 'components/agreement/CustomerInformationStep'

const StepperStyle = styled(Stepper)(({ theme }) => ({
  color: 'white',
}))

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

const StepLabelStyle = styled(StepLabel)(({ theme }) => ({
  '& .MuiStepLabel-label': {
    color: 'white!important',
    opacity: 0.6,
    '&.Mui-active': {
      opacity: 1,
    },
    '&.Mui-completed': { opacity: 1 },
  },
  '& .MuiStepLabel-iconContainer': {
    '& .Mui-active': {
      '& circle': {
        opacity: 1,
      },
    },
    '& .Mui-completed': {
      '& path': {
        fill: 'white',
        color: 'white',
        opacity: 1,
      },
    },
  },

  '& .MuiStepLabel-iconContainer text': {
    // TODO: use theme value here
    fill: '#507992',
    fontWeight: 'bold',
  },
  '& .MuiStepLabel-iconContainer circle': {
    // TODO: use theme value here
    opacity: 0.6,
    fill: 'white',
  },
}))

const steps = [
  {
    label: 'Customer Information',
  },
  {
    label: 'Service Information',
  },
  {
    label: 'Pricing',
  },
  {
    label: 'Order & Acknowledgment',
  },
]

function Agreement() {
  const theme = useTheme()
  const [activeStep, setActiveStep] = useState(0)
  const [agreementRead, setAgreementRead] = useState(false)
  const [currentLegalView, setCurrentLegalView] = useState(null)
  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm({ mode: 'onChange' })

  const [open, setOpen] = useState(false)
  const [scroll, setScroll] = React.useState('paper')

  const handleClickOpen = (legalView) => () => {
    setOpen(true)
    setCurrentLegalView(legalView)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const descriptionElementRef = React.useRef(null)
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef
      if (descriptionElement !== null) {
        descriptionElement.focus()
      }
    }
  }, [open])

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  return (
    <>
      {activeStep !== steps.length && (
        <FullScreenColumn type="brandDark" item xs={12} sm={5} lg={3}>
          <Box sx={{ textAlign: 'center', width: '100%' }}>
            <AlunaLogo
              width="115"
              fill="white"
              style={{
                marginTop: theme.spacing(3),
                marginBottom: theme.spacing(12),
              }}
            />
            <StepperStyle activeStep={activeStep} orientation="vertical">
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabelStyle
                    optional={
                      index === 3 ? (
                        <Typography variant="caption" color="white">
                          Last step
                        </Typography>
                      ) : null
                    }
                  >
                    {step.label}
                  </StepLabelStyle>
                </Step>
              ))}
            </StepperStyle>
          </Box>
        </FullScreenColumn>
      )}

      <FullScreenColumn
        item
        sx={{ display: 'initial', padding: theme.spacing(6) }}
        sm={7}
        lg={9}
      >
        {steps.map((step, index) => {
          if (activeStep === index) {
            console.log('step: ', step)
            return (
              <>
                <Typography
                  variant="h1"
                  sx={{
                    textAlign: 'center',
                    fontSize: '2rem',
                    fontWeight: 'normal',
                    marginBottom: theme.spacing(12),
                  }}
                >
                  Aluna Customer Agreement
                </Typography>
                {index === 0 && <CustomerInformationStep />}
                {index === 1 && (
                  <>
                    <LegalCopy>
                      Customer agrees to purchase use of the Aluna software
                      platform and associated devices and services from Aluna,
                      according to the applicable Terms &amp; Conditions set
                      forth in the Customer Agreement. The Aluna software
                      platform provides a provider engagement platform that
                      includes patient monitoring capabilities to facilitate
                      remote patient monitoring (“RPM”) services. The provider
                      platform allows providers to track and monitor their
                      patients’ Forced Expiratory Volume In One Second (“FEV1”)
                      levels and other health data through a digital home-based
                      spirometer.
                    </LegalCopy>

                    <Form
                      noValidate
                      method="post"
                      sx={{
                        display: 'block',
                        maxWidth: 400,
                        margin: '0 auto',
                        mt: theme.spacing(6),
                      }}
                      onSubmit={() => console.log(`"form 2 captured`)}
                    >
                      <Typography variant="h2" sx={{ mb: 2 }}>
                        Payment Method
                      </Typography>
                      <Controller
                        control={control}
                        name="paymentMethod"
                        rules={{
                          required: 'payment type required',
                        }}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <FormControl
                            sx={{ mt: 1, width: '100%' }}
                            error={error ? true : false}
                          >
                            <CustomInputLabel htmlFor="state-select-label">
                              Payment Method
                            </CustomInputLabel>
                            <Select
                              labelId="payment-select-label"
                              id="paymentMethod"
                              value={'Credit Card'}
                              label="Payment Method"
                              required
                              size="small"
                              error={!!error}
                              onChange={onChange}
                            >
                              <MenuItem value="AK">Credit Card</MenuItem>
                              <MenuItem value="AL">ACH Transfer</MenuItem>
                            </Select>
                            {error ? (
                              <FormHelperText>{error.message}</FormHelperText>
                            ) : null}
                          </FormControl>
                        )}
                      />
                      <Controller
                        control={control}
                        name="cardNumber"
                        rules={{
                          required: 'card number required',
                        }}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <TextField
                            size="small"
                            sx={{ flexGrow: 1 }}
                            onChange={onChange}
                            data-cy="cardNumber"
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="cardNumber"
                            label="Card Number"
                            placeholder=""
                            type="text"
                            error={!!error}
                            helperText={error ? error.message : null}
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="nameOnCard"
                        rules={{
                          required: 'name as it appears on card required',
                        }}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <TextField
                            size="small"
                            sx={{ flexGrow: 1 }}
                            onChange={onChange}
                            data-cy="nameOnCard"
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="nameOnCard"
                            label="Name on Card"
                            placeholder=""
                            type="text"
                            error={!!error}
                            helperText={error ? error.message : null}
                          />
                        )}
                      />
                      <div style={{ display: 'flex' }}>
                        <Controller
                          control={control}
                          name="expiration"
                          rules={{
                            required: 'expiration required',
                          }}
                          render={({
                            field: { onChange, value },
                            fieldState: { error },
                          }) => (
                            <FormControl
                              sx={{ mt: 1, mr: 1, width: 90 }}
                              error={error ? true : false}
                            >
                              <CustomInputLabel htmlFor="expiration-select-label">
                                01
                              </CustomInputLabel>
                              <Select
                                labelId="expiration-select-label"
                                id="expiration"
                                value={value}
                                label="Expiration Date"
                                required
                                size="small"
                                error={!!error}
                                onChange={onChange}
                              >
                                <MenuItem value="01">01</MenuItem>
                                <MenuItem value="02">02</MenuItem>
                                <MenuItem value="03">03</MenuItem>
                                <MenuItem value="...">...</MenuItem>
                              </Select>
                              {error ? (
                                <FormHelperText>{error.message}</FormHelperText>
                              ) : null}
                            </FormControl>
                          )}
                        />

                        <Controller
                          control={control}
                          name="state"
                          rules={{
                            required: 'state required',
                          }}
                          render={({
                            field: { onChange, value },
                            fieldState: { error },
                          }) => (
                            <FormControl
                              sx={{ mt: 1, mr: 1, width: 90 }}
                              error={error ? true : false}
                            >
                              <CustomInputLabel htmlFor="state-select-label">
                                2024
                              </CustomInputLabel>
                              <Select
                                labelId="state-select-label"
                                id="state"
                                value={value}
                                label="State"
                                required
                                autoWidth
                                size="small"
                                error={!!error}
                                onChange={onChange}
                              >
                                <MenuItem value="2023">2023</MenuItem>
                                <MenuItem value="2022">2022</MenuItem>
                                <MenuItem value="2021">2021</MenuItem>
                                <MenuItem value="...">...</MenuItem>
                              </Select>
                              {error ? (
                                <FormHelperText>{error.message}</FormHelperText>
                              ) : null}
                            </FormControl>
                          )}
                        />
                        <Controller
                          control={control}
                          name="cvc"
                          rules={{
                            required: 'cvc required',
                          }}
                          render={({
                            field: { onChange, value },
                            fieldState: { error },
                          }) => (
                            <TextField
                              sx={{ marginTop: 1, width: 80 }}
                              size="small"
                              onChange={onChange}
                              data-cy="cvc"
                              variant="outlined"
                              margin="normal"
                              required
                              name="cvc"
                              label="CVC"
                              placeholder="cvc"
                              type="text"
                              error={!!error}
                              helperText={error ? error.message : null}
                            />
                          )}
                        />
                      </div>
                      <div style={{ display: 'flex' }}>
                        <Controller
                          control={control}
                          name="billingAddress"
                          rules={{
                            required: 'billing address required',
                          }}
                          render={({
                            field: { onChange, value },
                            fieldState: { error },
                          }) => (
                            <TextField
                              sx={{
                                marginTop: 1,
                                marginRight: 1,
                                flexGrow: 1,
                              }}
                              size="small"
                              onChange={onChange}
                              data-cy="billingAddress"
                              variant="outlined"
                              margin="normal"
                              name="billingAddress"
                              label="Billing Address"
                              required
                              type="text"
                              error={!!error}
                              helperText={error ? error.message : null}
                            />
                          )}
                        />
                        <Controller
                          control={control}
                          name="state"
                          rules={{
                            required: 'state required',
                          }}
                          render={({
                            field: { onChange, value },
                            fieldState: { error },
                          }) => (
                            <FormControl
                              sx={{ mt: 1, mr: 1, width: 90 }}
                              error={error ? true : false}
                            >
                              <CustomInputLabel htmlFor="state-select-label">
                                State
                              </CustomInputLabel>
                              <Select
                                labelId="state-select-label"
                                id="state"
                                value={value}
                                label="State"
                                required
                                autoWidth
                                size="small"
                                error={!!error}
                                onChange={onChange}
                              >
                                <MenuItem value="AK">Alaska</MenuItem>
                                <MenuItem value="AL">Alabama</MenuItem>
                                <MenuItem value="AR">Arkansas</MenuItem>
                                <MenuItem value="...">...</MenuItem>
                              </Select>
                              {error ? (
                                <FormHelperText>{error.message}</FormHelperText>
                              ) : null}
                            </FormControl>
                          )}
                        />
                        <Controller
                          control={control}
                          name="zip"
                          rules={{
                            required: 'zip required',
                          }}
                          render={({
                            field: { onChange, value },
                            fieldState: { error },
                          }) => (
                            <TextField
                              sx={{ marginTop: 1, width: 80 }}
                              size="small"
                              onChange={onChange}
                              data-cy="zip"
                              variant="outlined"
                              margin="normal"
                              required
                              name="zip"
                              label="Zip"
                              placeholder="zip"
                              type="text"
                              error={!!error}
                              helperText={error ? error.message : null}
                            />
                          )}
                        />
                      </div>
                    </Form>
                  </>
                )}
                {index === 2 && (
                  <LegalCopy>
                    Customer will pay Aluna $50/month per patient for use of
                    Aluna’s digital spirometer device, access to Aluna’s
                    software platform, clinical care support, billing support,
                    and customer support in accordance with the Terms &amp;
                    Conditions referenced herein. Introductory Pricing: 50% off
                    for first 90 days = $25/month per patient. All payments are
                    due to Aluna within 60 days of receipt of invoice. Late
                    payments may be subject to 1.5% interest (or the maximum
                    allowable rate). All amounts listed below are in U.S.
                    Dollars.
                  </LegalCopy>
                )}
                {index === 3 && (
                  <>
                    <LegalCopy>
                      <Grid container spacing={6}>
                        <Grid item sm={5}>
                          <Typography variant="h2" sx={{ mb: 2 }}>
                            Item
                          </Typography>
                          <Typography variant="body1">
                            <ul
                              style={{
                                margin: 0,
                                paddingLeft: theme.spacing(3),
                              }}
                            >
                              <li>Digital Spirometer Device &amp; Shipping</li>
                              <li>Aluna Software Platform</li>
                              <li>Customer Support</li>
                              <li>Clynical Care Support</li>
                              <li>Billing Support</li>
                            </ul>
                          </Typography>
                        </Grid>
                        <Grid item sm={4}>
                          <Typography variant="h2" sx={{ mb: 2 }}>
                            Price
                          </Typography>
                          <Typography variant="body1">
                            $50/month per patient;
                            <br />
                            Introductory Pricing: $20/month per patient for
                            first 90 days
                          </Typography>
                        </Grid>
                        <Grid item sm={3}>
                          <Typography variant="h2" sx={{ mb: 1 }}>
                            Quantity
                          </Typography>
                          <Controller
                            control={control}
                            name="quantity"
                            rules={{
                              required: 'name as it appears on card required',
                            }}
                            render={({
                              field: { onChange, value },
                              fieldState: { error },
                            }) => (
                              <TextField
                                size="small"
                                sx={{ flexGrow: 1, maxWidth: 120 }}
                                onChange={onChange}
                                data-cy="quantity"
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="quantity"
                                label="Quantity"
                                placeholder=""
                                type="number"
                                value="50"
                                error={!!error}
                                helperText={error ? error.message : null}
                              />
                            )}
                          />
                        </Grid>
                      </Grid>
                    </LegalCopy>
                    <Typography variant="body2" sx={{ mt: 6, mb: 4 }}>
                      By clicking “Accept &amp; Submit” below, you acknowledge
                      that you have read, understand, and agree to purchase the
                      items and services (the “Services”) indicated above
                      according to the applicable Terms and Conditions,
                      including without limitation all warranty disclaimers,
                      liability limitations, and use limitations. You also
                      acknowledge and understand that doing so forms a legally
                      binding contract between your organization and Knox
                      Medical Diagnostics Inc., a Delaware Corporation
                      (“Aluna”), with its principal address at 345 California
                      Street, Suite 700 San Francisco, CA 94104 and you
                      represent that you are legally authorized to enter into a
                      legally binding contract on behalf of your organization.
                      Prior to clicking “Submit” below, please click below to
                      indicate that you have read, understand, and agree to each
                      of the following:
                    </Typography>

                    <FormControlLabel
                      control={<Checkbox name="agreeSoftwareTerms" />}
                      label={
                        <>
                          I agree to the{' '}
                          <Link onClick={handleClickOpen('/legal/terms')}>
                            Software License &amp; General Terms
                          </Link>
                        </>
                      }
                    />

                    <br />

                    <FormControlLabel
                      control={<Checkbox name="agreeDeviceTerms" />}
                      label={
                        <>
                          I agree to the{' '}
                          <Link onClick={handleClickOpen('/legal/terms')}>
                            Device Terms &amp; Conditions
                          </Link>
                        </>
                      }
                    />
                    <br />
                    <FormControlLabel
                      control={<Checkbox name="agreeMonitoringTerms" />}
                      label="Monitoring Terms &amp; Conditions"
                      label={
                        <>
                          I agree to the{' '}
                          <Link onClick={handleClickOpen('/legal/terms')}>
                            Monitoring Terms &amp; Conditions
                          </Link>
                        </>
                      }
                    />

                    <Dialog
                      open={open}
                      onClose={handleClose}
                      scroll={scroll}
                      aria-labelledby="scroll-dialog-title"
                      aria-describedby="scroll-dialog-description"
                      maxWidth={false}
                    >
                      <DialogContent
                        dividers={scroll === 'paper'}
                        sx={{ padding: 0 }}
                      >
                        <DialogContentText
                          id="scroll-dialog-description"
                          ref={descriptionElementRef}
                          tabIndex={-1}
                        >
                          <iframe
                            id="inlineFrameExample"
                            style={{ border: 'none' }}
                            title="Inline Frame Example"
                            width="900"
                            height="600"
                            src={currentLegalView}
                          ></iframe>
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleClose}>Decline</Button>
                        <Button
                          onClick={handleClose}
                          disabled={agreementRead}
                          variant="contained"
                        >
                          I Agree
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </>
                )}
                <div
                  style={{
                    position: 'fixed',
                    bottom: theme.spacing(6),
                    right: theme.spacing(6),
                  }}
                >
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1
                      ? 'Accept & Submit'
                      : 'Confirm & Continue'}
                  </Button>
                </div>
              </>
            )
          }
        })}
        {activeStep === steps.length && (
          <Paper square elevation={0} sx={{ p: 3 }}>
            <Typography
              variant="h1"
              sx={{ fontSize: '3rem', fontWeight: 'normal' }}
              gutterBottom
            >
              Welcome to Aluna!
            </Typography>
            <Typography variant="body1">
              We've sent an email to [useremail@mail.com] with a link to create
              your account.
            </Typography>
          </Paper>
        )}
      </FullScreenColumn>
    </>
  )
}

Agreement.layout = 'basic'

export default Agreement
