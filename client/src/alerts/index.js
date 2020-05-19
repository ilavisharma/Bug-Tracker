import Swal from 'sweetalert2';

export const ConfirmAlert = (text, confirmButtonText) =>
  Swal.fire({
    title: 'Are you sure',
    text,
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText,
    icon: 'warning'
  });

export const SuccessAlert = text => Swal.fire('Done', text, 'success');

export const ErrorAlert = text =>
  Swal.fire('Oops', text || 'There was some error', 'error');
