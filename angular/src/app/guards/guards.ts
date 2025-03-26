import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthenticationService } from "../service/authentication.service";

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthenticationService)
    const router = inject(Router)

    if (!authService.isAuthenticated()) {
      console.log(">> AuthGuard: Not authenticated! Redirecting to /")
      authService.clearToken();
      return router.parseUrl('/')
    }

    return true
};

export const roleGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthenticationService)
    const router = inject(Router)

    const expectedRole = route.data['expectedRole']

    if (authService.getTokenRole() !== expectedRole) {
        return router.parseUrl('/')
    }

    return true;
};

export const autologinGuard: CanActivateFn = (route, state) => {

    const authService = inject(AuthenticationService)
    const router = inject(Router)

    const existingTokenRole = authService.getTokenRole()
    if (existingTokenRole !== null) {
        if (existingTokenRole === "BUSINESS") {
            return router.parseUrl('/business')
        } else if (existingTokenRole === "APPLICANT") {
            return router.parseUrl('/applicant')
        }
    }

    return true;
};


export const premiumGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthenticationService)
    const router = inject(Router)

    const expectedPremium = route.data['expectedPremium']

    if (authService.getTokenPremium() !== expectedPremium) {
        return router.parseUrl('/business/premium')
    }

    return true;
};
