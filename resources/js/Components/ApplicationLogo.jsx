export default function ApplicationLogo(props) {
    return (
        <img
            {...props}
            src="/logo.png" // This path points to the public directory
            alt="University of St. La Salle Career Development Centre Logo"
            style={{ maxWidth: "200px", height: "auto" }}
        />
    );
}
