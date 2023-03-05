export const ErrorNotification = ({ message }) => {
    if (message === null) return null
    
    return (
        <div className='error-message'>
            {message}
        </div>
    )
}

export const SuccessNotification = ({ message }) => {
    if (message === null) return null
    
    return (
        <div className='success-message'>
            {message}
        </div>
    )
}