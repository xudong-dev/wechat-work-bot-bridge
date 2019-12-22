import { message } from "antd";
import ApolloClient from "apollo-boost";

export default new ApolloClient({
  request: operation => {
    const token = localStorage.getItem("token");
    if (token) {
      operation.setContext({ headers: { authorization: `Bearer ${token}` } });
    }
  },
  onError: ({ graphQLErrors }) => {
    if (graphQLErrors && graphQLErrors.length > 0) {
      message.error(graphQLErrors[0].message.error);

      graphQLErrors.some(graphQLError => {
        if (graphQLError.message.statusCode === 401) {
          localStorage.removeItem("token");
          window.location.href = "/auth/login";
          return true;
        }

        return false;
      });
    }
  }
});
