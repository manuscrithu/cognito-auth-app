import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { signIn } from 'aws-amplify/auth';

const LoginForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const initialValues = {
    username: '',
    password: '',
  };

  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = async (values: typeof initialValues, { setSubmitting, setFieldError }: any) => {
    try {
      await signIn({ username: values.username, password: values.password });
      onSuccess();
    } catch (error: any) {
      if (error.code === 'UserNotFoundException') {
        setFieldError('username', 'User not found');
      } else if (error.code === 'NotAuthorizedException') {
        setFieldError('password', 'Incorrect password');
      } else {
        alert(error.message || 'Unknown error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-form" style={{ maxWidth: 400, margin: '0 auto' }}>
      <h2>Login</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label htmlFor="username">Username</label>
              <Field name="username" type="text" />
              <div style={{ color: 'red' }}><ErrorMessage name="username" /></div>
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <Field name="password" type="password" />
              <div style={{ color: 'red' }}><ErrorMessage name="password" /></div>
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginForm;
