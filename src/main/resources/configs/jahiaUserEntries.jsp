<%@ page import="org.apache.commons.lang.StringUtils"%>
    <%@ page import="org.jahia.params.valves.LogoutConfig"%>
    <%@ page import="org.jahia.bin.Logout"%><%@ page import="java.net.URLEncoder"%>
    <%@ page language="java" contentType="text/javascript" %>
    <%-- Read logout url as done in org.jahia.services.render.URLGenerator.getLogout() --%>
    <%
    String redirectUrl = "?redirect=" + request.getContextPath() + "/start";
    String encodedRedirectUrl = URLEncoder.encode(redirectUrl, "UTF-8");
    String customLogoutUrl = LogoutConfig.getInstance().getCustomLogoutUrl(request);
    %>
    contextJsParameters.config.logoutUrl = "<%=StringUtils.isNotEmpty(customLogoutUrl) ? customLogoutUrl + encodedRedirectUrl :  request.getContextPath() + Logout.getLogoutServletPath() + redirectUrl%>";

