import config from '../config';

let autoApprove = config.enableAutoMerchantApprove;

export function isAutoApproveEnabled() {
  return autoApprove;
}

export function setAutoApprove(value: boolean) {
  autoApprove = value;
}
