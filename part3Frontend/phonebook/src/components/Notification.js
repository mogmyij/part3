const Notification = ({ message, errorCode}) => {
  const successStyle = {
    color: "green",
    background: "lightgrey",
    fontSize: "20px",
    borderStyle: "solid",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px",
  };
  const errorStyle = {
    color: "red",
    background: "lightgrey",
    fontSize: "20px",
    borderStyle: "solid",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px",
  };
  if (message === null) return null;
  if (errorCode === 0) return <div style={successStyle}>{message}</div>;
  if (errorCode === 1) return <div style={errorStyle}>{message}</div>;
};

export default Notification;
