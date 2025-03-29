const Notification = ({ message, code }) => {
  if (message == null) return null;
  if (code === 404) return <div className="error">{message}</div>;
  return <div className="notification">{message}</div>;
};
export default Notification;
