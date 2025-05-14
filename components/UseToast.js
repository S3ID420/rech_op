import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const useToast = () => {
  const showToast = (message, type = 'info') => {
    const options = {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'light',
    };

    switch (type) {
      case 'success':
        toast.success(message, options);
        break;
      case 'error':
        toast.error(message, options);
        break;
      case 'warning':
        toast.warn(message, options);
        break;
      case 'info':
      default:
        toast.info(message, options);
        break;
    }
  };

  const showConfirmToast = (message, confirmLabel = 'Confirm') => {
    return new Promise((resolve) => {
      const toastId = toast(
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '10px' }}>
          <span>{message}</span>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              style={{
                padding: '5px 10px',
                backgroundColor: '#48bb78',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
              onClick={() => {
                toast.dismiss(toastId);
                resolve(true);
              }}
            >
              {confirmLabel}
            </button>
            <button
              style={{
                padding: '5px 10px',
                backgroundColor: '#e53e3e',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
              onClick={() => {
                toast.dismiss(toastId);
                resolve(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>,
        {
          position: 'top-center',
          autoClose: false,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: 'light',
        }
      );
    });
  };

  return { showToast, showConfirmToast };
};

export default useToast;