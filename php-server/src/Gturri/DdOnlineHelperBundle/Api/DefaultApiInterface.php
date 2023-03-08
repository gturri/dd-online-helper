<?php

namespace Gturri\DdOnlineHelperBundle\Api;

use OpenAPI\Server\Api\DefaultApiInterface;

use OpenAPI\Server\Model\DicePostRequest;
use OpenAPI\Server\Model\LastEventsGet200ResponseInner;

class DefaultApi implements DefaultApiInterface {
	public function dicePost(?DicePostRequest $dicePostRequest, int &$responseCode, array &$responseHeaders): void {
		// TODO
	}


	public function lastEventsGet(string $room, ?string $after, int &$responseCode, array &$responseHeaders): array|object|null {
		// TODO
		$responseCode = 200;
		$event = new LastEventsGet200ResponseInner();
		$event->setTimestamp(new \DateTime());
		$event->setText("it works");
		return [$event];
	}

}
