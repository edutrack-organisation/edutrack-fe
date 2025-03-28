/**
 * Styles specific to the Generate Paper feature components
 * Contains Material-UI style configurations for:
 * - Modal layouts and variants
 * - Custom scrollbar appearance
 */

export const modalStyle = {
    position: "absolute",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "40%",
    minHeight: { xs: "80%", xl: "60%" },
    bgcolor: "background.paper",
    borderRadius: "1rem",
    boxShadow: 24,
    display: "flex",
    flexDirection: "column",
    p: 4,
};

export const modalVariants = {
    quickGenerate: {
        ...modalStyle,
        top: "50%",
    },
    addQuestion: {
        ...modalStyle,
        top: "40%",
    },
};
