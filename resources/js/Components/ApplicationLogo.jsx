export default function ApplicationLogo(props) {
    return (
        <img
            {...props}
            src="/StellarPathLogo.png" // This path points to the public directory
            alt="University of St. La Salle Career Development Centre Logo"
            style={{ maxWidth: "50px", height: "auto" }}
        />
    );
}
