import { useEffect } from "react";
import { useRouter } from "next/router";
import { auth } from "@/firebase";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const user = auth.currentUser;

    useEffect(() => {
      if (!user) {
        router.push("/login"); // Redirect to login if not authenticated
      }
    }, [user, router]);

    return user ? <WrappedComponent {...props} /> : <p>Loading...</p>;
  };
};

export default withAuth;
