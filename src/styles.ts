/**
 * Global styles shared across multiple component/pages
 * Contains reusable Material-UI style configurations
 */

export const tableStyles = {
    container: {
        mt: "2rem",
    },
    table: {
        minWidth: 650,
    },
    textField: {
        "& .MuiTextField-root": {
            "& fieldset": {
                borderColor: "#E5EAF2",
            },
            "&:hover fieldset": {
                borderColor: "#B0BEC5",
            },
            "&.Mui-focused fieldset": {
                borderColor: "#1E88E5",
            },
        },
    },
    button: {
        display: "flex",
        alignItems: "center",
        mt: "1rem",
        variant: "contained",
    },
    icon: {
        height: "2rem",
        width: "2rem",
    },
};
