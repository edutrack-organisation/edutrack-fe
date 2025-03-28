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

export const scrollbarStyle = {
    "::-webkit-scrollbar": {
        width: "6px",
    },
    "::-webkit-scrollbar-track": {
        background: "#ebebeb",
        borderRadius: "8px",
    },
    "::-webkit-scrollbar-thumb": {
        background: "#c2c2c2",
        borderRadius: "8px",
    },
};
