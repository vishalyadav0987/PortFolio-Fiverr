import './Spinner.css'
const Spinner = () => {
    return (
        <div style={{
            width: "20px",
            height: "20px",
            border: "4px solid #f3f3f3",
            borderTop: "4px solid rgb(0, 0, 0)",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
        }} />
    );
};

export default Spinner;
