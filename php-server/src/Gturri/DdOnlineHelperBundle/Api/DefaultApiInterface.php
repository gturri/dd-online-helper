<?php

namespace Gturri\DdOnlineHelperBundle\Api;

use OpenAPI\Server\Api\DefaultApiInterface;

use OpenAPI\Server\Model\ApiDicePostRequest;
use OpenAPI\Server\Model\ApiLastEventsGet200ResponseInner;

use App\Entity\Message;
use App\Repository\MessageRepository;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;

class DefaultApi implements DefaultApiInterface {
	public function __construct(LoggerInterface $logger, EntityManagerInterface $entityManager, MessageRepository $messageRepository) {
		$this->entityManager = $entityManager;
		$this->messageRepository = $messageRepository;
		$this->logger = $logger;
	}

	public function apiDicePost(?ApiDicePostRequest $dicePostRequest, int &$responseCode, array &$responseHeaders): void {
		$message = new Message();
		$message->setRoom($dicePostRequest->getRoom());
		$message->setTimestamp(new \DateTimeImmutable());
		$message->setMessage($this->generateDiceMessage($dicePostRequest));

		$this->entityManager->persist($message);
		$this->entityManager->flush();
	}

	private function generateDiceMessage(ApiDicePostRequest $request) {
		$result = "{$request->getPlayer()} rolled dice:\n";

		foreach($request->getDice() as $dice){
			$result .= "{$dice->getNumberOfDice()}D{$dice->getNumberOfSides()}:";
			for($d=0 ; $d < $dice->getNumberOfDice() ; $d++ ){
				$result .= mt_rand(1, $dice->getNumberOfSides()) . ";";
			}
			$result .= "\n";
		}

		return $result;
	}

	public function apiLastEventsGet(string $room, ?int $afterId, int &$responseCode, array &$responseHeaders): array|object|null {
		$this->logger->info("getting last events, afterId = {$afterId}");
		$messages = array();
		if (is_null($afterId)) {
			$messages = $this->messageRepository->findAllInRoom($room);
		} else {
			$messages = $this->messageRepository->findAllInRoomMoreRecentThan($afterId, $room);
		}

		$result = array();
		foreach($messages as $m) {
			$event = new ApiLastEventsGet200ResponseInner();
			$event->setTimestamp(\DateTime::createFromImmutable($m->getTimestamp()));
			$event->setText($m->getMessage());
			$event->setId($m->getId());
			$result []= $event;
		}
		return $result;
	}

}
