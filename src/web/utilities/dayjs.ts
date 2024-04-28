import dayjs from 'dayjs/esm';
import relativeTime from 'dayjs/esm/plugin/relativeTime';

// eslint-disable-next-line import/no-named-as-default-member
dayjs.extend(relativeTime);

export { dayjs };
