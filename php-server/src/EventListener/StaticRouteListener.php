<?php
namespace App\EventListener;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\DependencyInjection\ParameterBag\ContainerBagInterface;

class StaticRouteListener {
	private $bag;

	public function __construct(ContainerBagInterface $bag) {
		$this->bag= $bag;
	}

	public function __invoke(RequestEvent $event): void {
		$request = $event->getRequest();
		if ($this->isRequestToBeHandledByTheFront($request)) {
			$request->attributes->set('_controller', function(): Response {
				$content = file_get_contents($this->bag->get('kernel.project_dir')  . "/public/index.html");
				return new Response($content);
			});
		}
	}

	private function isRequestToBeHandledByTheFront(Request $request): bool {
		return !str_starts_with($request->getPathInfo(), "/api");
	}

}
