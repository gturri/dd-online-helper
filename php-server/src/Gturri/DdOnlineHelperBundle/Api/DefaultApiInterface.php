<?php

namespace Gturri\DdOnlineHelperBundle\Api;

use OpenAPI\Server\Api\DefaultApiInterface;

use OpenAPI\Server\Model\DicePostRequest;
use OpenAPI\Server\Model\LastEventsGet200ResponseInner;

use App\Entity\Message;
use Doctrine\ORM\EntityManagerInterface;

class DefaultApi implements DefaultApiInterface {
	public function __construct(EntityManagerInterface $entityManager) {
		$this->entityManager = $entityManager;
	}

	public function dicePost(?DicePostRequest $dicePostRequest, int &$responseCode, array &$responseHeaders): void {
		$message = new Message();
		$message->setRoom($dicePostRequest->getRoom());
		$message->setTimestamp(new \DateTimeImmutable());
		$message->setMessage($this->generateDiceMessage($dicePostRequest));

		$this->entityManager->persist($message);
		$this->entityManager->flush();
	}

	private function generateDiceMessage(DicePostRequest $request) {
		$result = "{$request->getPlayer()} threw dice:\n";

		foreach($request->getDice() as $dice){
			$result .= "{$dice->getNumberOfDice()}D{$dice->getNumberOfSides()}:";
			for($d=0 ; $d < $dice->getNumberOfDice() ; $d++ ){
				$result .= mt_rand(1, $dice->getNumberOfSides()) . ";";
			}
			$result .= "\n";
		}

		return $result;
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
