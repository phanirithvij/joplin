import { AppContext, KoaNext } from '../utils/types';
import { contextSessionId } from '../utils/requestUtils';
import { ErrorForbidden } from '../utils/errors';
import { cookieSet } from '../utils/cookies';

export default async function(ctx: AppContext, next: KoaNext): Promise<void> {
	const sessionId = contextSessionId(ctx, false);
	const owner = sessionId ? await ctx.joplin.models.session().sessionUser(sessionId) : null;
	if (owner && !owner.enabled) {
		cookieSet(ctx, 'sessionId', ''); // Clear cookie, otherwise the user cannot login at all anymore
		throw new ErrorForbidden('This user account is disabled. Please contact support.');
	}
	ctx.joplin.owner = owner;
	return next();
}
